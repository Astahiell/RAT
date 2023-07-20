const uuid = window.location.pathname.split("/")[2];
const username = sessionStorage.getItem("username");
const addButton = document.getElementById("add-pin-button");
const saveButton = document.getElementById("save-pins-button");
const pinDescriptionDiv = document.getElementById("pin-description-div");
let addingPinEnabled;
var pinsObject;
var existingIDs = [];
var markers = [];
// const checkAuth = async () => {
//   const token = sessionStorage.getItem("token");
//   try {
//     const { data } = await axios.get("/api/v1/verify", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       }
//     });
//     console.log(data)
//   } catch (error) {
//     console.log(error);
//   }
// };
const getRandomLetters = (length = 1) =>
  Array(length)
    .fill()
    .map((e) => String.fromCharCode(Math.floor(Math.random() * 26) + 65))
    .join("");
const getRandomDigits = (length = 1) =>
  Array(length)
    .fill()
    .map((e) => Math.floor(Math.random() * 10))
    .join("");
const generateUniqueID = () => {
  let id = getRandomLetters(2) + getRandomDigits(4);
  while (existingIDs.includes(id))
    id = getRandomLetters(2) + getRandomDigits(4);
  return id;
};

const map = L.map("map", {
  crs: L.CRS.Simple,
  minZoom: -5,
  maxZoom: 10,
  center: [0, 0],
  zoom: 1,
  maxBoundsViscosity: 1,
  attributionControl: false,
});
map.on("click", addMarker);
const getRoute = async () => {
  if (username == null) {
    location.href = "/login";
  }
  try {
    const { data } = await axios.get(`/api/v1/getroute/${username}/${uuid}`);
    let route = JSON.parse(data.route[0]);
    let pins = JSON.parse(data.pins[0]);
    document.title = route.name;
    pinsObject = pins;
    getMap(route.map);
    getPins(pins);
  } catch (error) {
    if (error.response.status == 401) {
      location.href = "/404";
    }
  }
};
const getMap = async (mapLink) => {
  const mapImage = new Image();
  mapImage.src = await mapLink;
  const x = mapImage.height;
  const y = mapImage.width;
  const bounds = [
    [0, 0],
    [x, y],
  ];
  const image = await L.imageOverlay(mapLink, bounds).addTo(map);
  map.setView([x / 2, y / 2], -1);
};
const getPins = async (pinsObject) => {
  for (i = 0; i < pinsObject.pins.length; i++) {
    addingPinEnabled = true;
    loadMarker(pinsObject.pins[i]);
    createPinDescription(pinsObject.pins[i]);
    addingPinEnabled = false;
  }
};
const createPinDescription = (pin) => {
  const pinDiv = document.createElement("div");
  const name = document.createElement("input");
  const groups = document.createElement("input");
  const description = document.createElement("textarea");
  const imageLink = document.createElement("input");
  const image = document.createElement("img");
  const pool = document.createElement("input");
  const icon = document.createElement("input");
  pinDiv.setAttribute("id", "pin" + pin.id);
  name.value = pin.name;
  name.setAttribute("id", "name" + pin.id);
  groups.value = pin.groups;
  groups.setAttribute("id", "groups" + pin.id);
  description.value = pin.description;
  description.setAttribute("id", "description" + pin.id);
  imageLink.value = pin.image;
  imageLink.setAttribute("id", "image" + pin.id);
  image.src = pin.image;
  pool.value = pin.pool;
  pool.setAttribute("id", "pool" + pin.id);
  icon.value = pin.icon;
  icon.setAttribute("id", "icon" + pin.id);
  pinDiv.appendChild(name);
  pinDiv.appendChild(groups);
  pinDiv.appendChild(description);
  pinDiv.appendChild(imageLink);
  pinDiv.appendChild(image);
  pinDiv.appendChild(pool);
  pinDiv.appendChild(icon);
  pinDiv.classList.add("pin-description");
  pinDescriptionDiv.appendChild(pinDiv);
};
const createPinDescriptionOnClick = (id) => {
  const match = pinsObject.pins.findIndex((pin) => pin.id == id);
  const pinDiv = document.createElement("div");
  const name = document.createElement("input");
  const groups = document.createElement("input");
  const description = document.createElement("textarea");
  const imageLink = document.createElement("input");
  const image = document.createElement("img");
  const pool = document.createElement("input");
  const icon = document.createElement("input");
  pinDiv.setAttribute("id", "pin" + pinsObject.pins[match].id);
  name.value = pinsObject.pins[match].name;
  name.setAttribute("id", "name" + pinsObject.pins[match].id);
  groups.value = pinsObject.pins[match].groups;
  groups.setAttribute("id", "groups" + pinsObject.pins[match].id);
  description.value = pinsObject.pins[match].description;
  description.setAttribute("id", "description" + pinsObject.pins[match].id);
  imageLink.value = pinsObject.pins[match].image;
  imageLink.setAttribute("id", "image" + pinsObject.pins[match].id);
  image.src = pinsObject.pins[match].image;
  pool.value = pinsObject.pins[match].pool;
  pool.setAttribute("id", "pool" + pinsObject.pins[match].id);
  icon.value = pinsObject.pins[match].icon;
  icon.setAttribute("id", "icon" + pinsObject.pins[match].id);
  pinDiv.appendChild(name);
  pinDiv.appendChild(groups);
  pinDiv.appendChild(description);
  pinDiv.appendChild(imageLink);
  pinDiv.appendChild(image);
  pinDiv.appendChild(pool);
  pinDiv.appendChild(icon);
  pinDiv.classList.add("pin-description");
  pinDescriptionDiv.appendChild(pinDiv);
};
function loadMarker(pin) {
  var newMarker = new L.marker([pin.lat, pin.lng]).on("click", markerOnClick);
  existingIDs.push(pin.id);
  newMarker.title = pin.name;
  newMarker.alt = pin.id;
  addRowTable(newMarker.title, pin.lat, pin.lng, pin.id);
  map.addLayer(newMarker);
  markers.push(newMarker);
}
function addMarker(e) {
  if (addingPinEnabled) {
    var newMarker = new L.marker(e.latlng).on("click", markerOnClick);
    id = generateUniqueID();
    existingIDs.push(id);
    newMarker.title = "New Pin";
    newMarker.alt = id;
    pinsObject.pins.push({
      id: id,
      name: "Your pin",
      groups: "groups1",
      description: "Your Amazing Pin",
      image:
        "https://cdn.discordapp.com/attachments/929114840088330371/1135611016433115266/image.png",
      pool: "pool1",
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      icon: "test",
    });
    addRowTable(newMarker.title, e.latlng.lat, e.latlng.lng, id);
    createPinDescriptionOnClick(id);
    map.addLayer(newMarker);
    markers.push(newMarker);s
    addingPinEnabled = false;
  }
}
addButton.addEventListener("click", function () {
  addingPinEnabled = true;
});
function addRowTable(name, lat, lng, id) {
  var tr = document.createElement("tr");
  tr.setAttribute("id", "pintr" + id);
  var td = document.createElement("td");
  var td2 = document.createElement("button");
  td.textContent = name;
  td2.setAttribute("onclick", "deleteMarker(this.id)");
  td2.setAttribute("id", id);
  td2.textContent = "Delete Marker";
  tr.appendChild(td);
  tr.appendChild(td2);
  td.onclick = function () {
    map.flyTo([lat, lng], 0);
    showPinDescription(id);
  };
  document.getElementById("t_points").appendChild(tr);
}
function markerOnClick(e) {
  showPinDescription(e.target.alt);
}
const showPinDescription = (id) => {
  for (i = 0; i < pinsObject.pins.length; i++) {
    document
      .querySelectorAll("div#pin-description-div > div")
      [i].classList.add("pin-description");
  }
  const pinDiv = document.getElementById("pin" + id);
  pinDiv.classList.remove("pin-description");
};
const deleteMarker = (id) => {
  for (i = 0; i < markers.length; i++) {
    if (markers[i].alt == id) {
      map.removeLayer(markers[i]);
      markers.splice(i, 1);
      document.getElementById("pin" + id).remove();
      document.getElementById("pintr" + id).remove();
    }
    if (pinsObject.pins[i].id == id) {
      pinsObject.pins.splice(i, 1);
      break;
    }
  }
};
const savePins = async () => {
  for (i = 0; i < pinsObject.pins.length; i++) {
    const name = document.getElementById(`name${pinsObject.pins[i].id}`).value;
    const groups = document.getElementById(
      `groups${pinsObject.pins[i].id}`
    ).value;
    const description = document.getElementById(
      `description${pinsObject.pins[i].id}`
    ).value;
    const imageLink = document.getElementById(
      `image${pinsObject.pins[i].id}`
    ).value;
    const pools = document.getElementById(`pool${pinsObject.pins[i].id}`).value;
    const icon = document.getElementById(`icon${pinsObject.pins[i].id}`).value;
    pinsObject.pins[i].name = name;
    pinsObject.pins[i].groups = groups;
    pinsObject.pins[i].description = description;
    pinsObject.pins[i].image = imageLink;
    pinsObject.pins[i].pool = pools;
    pinsObject.pins[i].icon = icon;
  }
  try {
    const { data } = await axios.post(`/api/v1/saveroute`, {
      pinsObject,
      username,
      uuid,
    });
  } catch (error) {
    console.log(error);
  }
};
