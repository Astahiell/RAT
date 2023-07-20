let newSpaceAddButton = document.getElementById("add-space-button");
let newRouteName = document.getElementById("new-space-name");
let newSpaceImage = document.getElementById("new-space-image");
let username = sessionStorage.getItem("username");
let routesList = document.getElementById("routes-list");
// /(https?:\/\/.*\.(?:png|jpg))/i
const editRoute = async (routeuuid) => {
  const routeName = document.getElementById("name" + routeuuid).value;
  const routeDescription = document.getElementById(
    "description" + routeuuid
  ).value;
  const routeCategory = document.getElementById("category" + routeuuid).value;
  const routeMap = document.getElementById("map" + routeuuid).value;

  let routeDivName = document.getElementById("route-name" + routeuuid);
  routeDivName.innerText = routeName;
  try {
    const { data } = await axios.post(`/api/v1/editroute`, {
      username,
      routeuuid,
      routeName,
      routeDescription,
      routeCategory,
      routeMap,
    });
  } catch (error) {
    console.log(error);
  }
};
const deleteRoute = async (routeuuid) => {
  try {
    const { data } = await axios.post("/api/v1/deleteroute", {
      username,
      routeuuid,
    });
    location.reload();
  } catch (error) {
    console.log(error);
  }
};
const getUserRoutes = async () => {
  if(username == null){
    location.href = "/login"
  }
  try {
    const { data } = await axios.get(`/api/v1/routes/getroutes/${username}`, {
      username,
    });
    for (i = 0; i < data.routes.length; i++) {
      let route = JSON.parse(data.routes[i]);
      let routeDiv = document.createElement("div");
      let routeName = document.createElement("p");
      let routeDelete = document.createElement("button");
      let routeEdit = document.createElement("div");
      let routeNameInput = document.createElement("input");
      let routeDescriptionInput = document.createElement("input");
      let routeCategoryInput = document.createElement("input");
      let routeMapInput = document.createElement("input");
      let routeEditButton = document.createElement("button");
      let gotoRouteButton = document.createElement("button");
      routeName.innerText = route.name;
      routeName.classList.add("route-name");
      routeName.setAttribute("id", "route-name" + route.uuid);
      routeDiv.classList.add(route.uuid, "route");
      routeDiv.setAttribute("id", route.uuid);
      gotoRouteButton.setAttribute("id", route.uuid);
      gotoRouteButton.setAttribute("onclick", `goToRoute(this.id)`);
      gotoRouteButton.innerText = "Go to Route";
      routeDelete.setAttribute("id", route.uuid);
      routeDelete.setAttribute("onclick", `deleteRoute(this.id)`);
      routeDelete.innerText = "Delete";
      routeEdit.classList.add("route-edit");
      routeNameInput.setAttribute("id", "name" + route.uuid);
      routeNameInput.value = route.name;
      routeDescriptionInput.setAttribute("id", "description" + route.uuid);
      routeDescriptionInput.value = route.description;
      routeCategoryInput.setAttribute("id", "category" + route.uuid);
      routeCategoryInput.value = route.category;
      routeMapInput.setAttribute("id", "map" + route.uuid);
      routeMapInput.value = route.map;
      routeEditButton.setAttribute("id", route.uuid);
      routeEditButton.setAttribute("onclick", "editRoute(this.id)");
      routeEditButton.innerText = "Edit Route";
      routeEdit.appendChild(routeNameInput);
      routeEdit.appendChild(routeDescriptionInput);
      routeEdit.appendChild(routeCategoryInput);
      routeEdit.appendChild(routeMapInput);
      routeDiv.appendChild(routeName);
      routeDiv.appendChild(routeEdit);
      routeDiv.appendChild(gotoRouteButton);
      routeDiv.appendChild(routeEditButton);
      routeDiv.appendChild(routeDelete);
      routesList.appendChild(routeDiv);
    }
  } catch (error) {
    console.log(error);
  }
};
const goToRoute = async (uuid) => {
  window.location.href = `/route/${uuid}`;
};
newSpaceAddButton.addEventListener("click", async () => {
  const routeName = newRouteName.value;
  const imageLink = newSpaceImage.value;

  try {
    const { data } = await axios.post("/api/v1/addroute", {
      username,
      routeName,
      imageLink,
    });
    location.reload();
  } catch (error) {
    console.log(error);
  }
});
