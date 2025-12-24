let mySelectors = {
  sectionsLinks: document.querySelectorAll("a[data-section]"),
  dateInput: document.getElementById("apod-date-input"),
  todayDate: new Date().toISOString().split("T")[0],
  apodImg: document.getElementById("apod-image"),
};
mySelectors.dateInput.nextElementSibling.innerHTML =
  new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

async function GetTodayPic(userDateChoice) {
  document.getElementById("apod-loading").classList.remove("hidden");
  mySelectors.apodImg.classList.add("hidden");
  let response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=aeC05vzci6qxEqsdudoVpIZU6eKQRlAnBws8yYIu&date=${
      userDateChoice || mySelectors.todayDate
    }`
  );
  let data = await response.json();
  if (response.ok) {
    displayTodayTopic(data);
    document.getElementById("apod-loading").classList.add("hidden");
    mySelectors.apodImg.classList.remove("hidden");
  } else {
    console.log("erorr");
  }
}
function displayTodayTopic(todayData) {
  let topicTitle = document.getElementById("apod-title");
  let dateInfo = document.getElementById("apod-date-info");
  let imgLink = document.getElementById("imgLink");
  let formatedDate = new Date(todayData.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  document.getElementById("apod-date").firstElementChild.innerHTML =
    formatedDate;
  topicTitle.innerHTML = todayData.title;
  topicTitle.nextElementSibling.lastElementChild.append(todayData.date);
  topicTitle.nextElementSibling.nextElementSibling.innerHTML =
    todayData.explanation;
  topicTitle.parentElement.lastElementChild.innerHTML = `<i class="fa-solid fa-copyright">   </i>  ${todayData.copyright}`;
  dateInfo.innerHTML = todayData.date;
  dateInfo.parentElement.nextElementSibling.lastElementChild.innerHTML =
    todayData.media_type;
  if (todayData.hdurl && todayData.hdurl !== undefined) {
    mySelectors.apodImg.setAttribute("src", todayData.hdurl);
    mySelectors.apodImg.setAttribute("alt", todayData.title);
    imgLink.setAttribute("href", todayData.hdurl);
  } else {
    document.getElementById("apod-loading").classList.remove("hidden");
  }
}
GetTodayPic();
function displayActiveSection(targetId) {
  let sections = document.querySelectorAll("section[data-section]");
  for (let i = 0; i < sections.length; i++) {
    sections[i].classList.add("hidden");
    mySelectors.sectionsLinks[i].classList.remove(
      "bg-blue-500/10",
      "text-blue-400"
    );
    mySelectors.sectionsLinks[i].classList.add(
      "text-slate-300",
      "hover:bg-slate-800"
    );
    if (sections[i].getAttribute("data-section") === targetId) {
      sections[i].classList.remove("hidden");
      mySelectors.sectionsLinks[i].classList.add(
        "bg-blue-500/10",
        "text-blue-400"
      );
      mySelectors.sectionsLinks[i].classList.remove(
        "text-slate-300",
        "hover:bg-slate-800"
      );
    }
  }
}
async function GetUpcomingLaunches() {
  let response = await fetch(
    "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=10"
  );
  let data = await response.json();
  if (response.ok) {
displayUpcomingLunches(data.results)

  } else {
    console.log("erorr");
  }
}
GetUpcomingLaunches();
async function GetAllPlanets() {
  let AllPlanetsBox = "";
  let TableRows = "";

  try {
    let response = await fetch(
      "https://solar-system-opendata-proxy.vercel.app/api/planets"
    );
    let data = await response.json();

    if (response.ok) {
      const mainPlanets = [
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune",
      ];
      const bodies = [];

      for (let i = 0; i < data.bodies.length; i++) {
        const planet = data.bodies[i];
        if (mainPlanets.includes(planet.englishName.toLowerCase())) {
          bodies.push(planet);
        }
      }
      bodies.sort(function (a, b) {
        return a.semimajorAxis - b.semimajorAxis;
      });

      const planetStyles = {
        mercury: { color: "#eab308", type: "Terrestrial", bg: "bg-orange-500/50 text-orange-200" },
        venus:   { color: "#f97316", type: "Terrestrial", bg: "bg-orange-500/50 text-orange-200" },
        earth:   { color: "#3b82f6", type: "Terrestrial", bg: "bg-blue-500/50 text-blue-200" },
        mars:    { color: "#ef4444", type: "Terrestrial", bg: "bg-red-500/50 text-red-200" },
        jupiter: { color: "#fb923c", type: "Gas Giant",   bg: "bg-purple-500/50 text-purple-200" },
        saturn:  { color: "#facc15", type: "Gas Giant",   bg: "bg-yellow-500/50 text-yellow-200" },
        uranus:  { color: "#06b6d4", type: "Ice Giant",   bg: "bg-cyan-500/50 text-cyan-200" },
        neptune: { color: "#2563eb", type: "Ice Giant",   bg: "bg-blue-500/50 text-blue-200" },
      };

      for (const planetData of bodies) {
        const distanceAU = (planetData.semimajorAxis / 149597870.7).toFixed(2);
        const diameter = (planetData.meanRadius * 2).toLocaleString();
        const planetMassKg = planetData.mass.massValue * Math.pow(10, planetData.mass.massExponent);
        const earthMassKg = 5.972 * Math.pow(10, 24);
        const relativeMass = (planetMassKg / earthMassKg).toFixed(3);
        const props = planetStyles[planetData.englishName.toLowerCase()];

        let orbitalPeriodDisplay = "";
        if (planetData.sideralOrbit > 365.25) {
          orbitalPeriodDisplay = `${(planetData.sideralOrbit / 365.25).toFixed(1)} years`;
        } else {
          orbitalPeriodDisplay = `${Math.round(planetData.sideralOrbit)} days`;
        }
        AllPlanetsBox += `          <div
                    class="planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group"
                    data-planet-id="${planetData.englishName.toLowerCase()}"
                    style="--planet-color: ${props.color}"
                    onmouseover="this.style.borderColor='${props.color}80'"
                    onmouseout="this.style.borderColor='#334155'"
                    >
                    <div class="relative mb-3 h-24 flex items-center justify-center">
                        <img
                        class="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
                        src="images/${planetData.englishName}.png"
                        alt="${planetData.englishName}"
                        />
                    </div>
                    <h4 class="font-semibold text-center text-sm">${planetData.englishName}</h4>
                    <p class="text-xs text-slate-400 text-center">${distanceAU} AU</p>
                    </div>`;
        TableRows += `<tr class="hover:bg-slate-800/30 transition-colors ${planetData.englishName.toLowerCase() === 'earth' ? 'bg-blue-500/5' : ''}">
                    <td class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10">
                        <div class="flex items-center space-x-2 md:space-x-3">
                        <div class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0" style="background-color: ${props.color}"></div>
                        <span class="font-semibold text-sm md:text-base whitespace-nowrap">${planetData.englishName}</span>
                        </div>
                    </td>
                    <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${distanceAU}</td>
                    <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${diameter}</td>
                    <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${relativeMass}</td>
                    <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${orbitalPeriodDisplay}</td>
                    <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${planetData.moons ? planetData.moons.length : 0}</td>
                    <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <span class="px-2 py-1 rounded text-xs ${props.bg}">${props.type}</span>
                    </td>
                    </tr>`;
        if (planetData.englishName.toLowerCase() === "earth") {
             displayClickedPlanet(planetData);
        }
      }
      document.getElementById("planets-grid").innerHTML = AllPlanetsBox;
      const tableBody = document.getElementById("planet-comparison-tbody");
      if (tableBody) {
        tableBody.innerHTML = TableRows;
      }

      const allCards = document.querySelectorAll('.planet-card');
      for(let i=0; i<allCards.length; i++) {
         allCards[i].addEventListener('click', function() {
             const pId = this.getAttribute('data-planet-id');
             for(let j=0; j<bodies.length; j++) {
                 if(bodies[j].englishName.toLowerCase() === pId) {
                     displayClickedPlanet(bodies[j]);
                     break;
                 }
             }
         });
      }

    } else {
      console.log("Error fetching API");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
GetAllPlanets()
function displayClickedPlanet(planetData) {
          const mass = planetData.mass? `${planetData.mass.massValue} × 10^${planetData.mass.massExponent} kg`: "N/A";
          const vol = planetData.vol
            ? `${planetData.vol.volValue} × 10^${planetData.vol.volExponent} km³`
            : "N/A";
          document.getElementById("selectedPlanet").innerHTML = `   <div
                            class="xl:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8"
                            >
                            <div
                                class="flex flex-col xl:flex-row xl:items-start space-y-4 xl:space-y-0"
                            >
                                <div
                                class="relative h-48 w-48 md:h-64 md:w-64 shrink-0 mx-auto xl:mr-6"
                                >
                                <img
                                    id="planet-detail-image"
                                    class="w-full h-full object-contain"
                                    src="images/${planetData.englishName}.png"
                                    alt="${planetData.englishName}"
                                />
                                </div>
                                <div class="flex-1">
                                <div class="flex items-center justify-between mb-3 md:mb-4">
                                    <h3
                                    id="planet-detail-name"
                                    class="text-2xl md:text-3xl font-space font-bold"
                                    >
                                    ${planetData.englishName}
                                    </h3>
                                    <button
                                    class="w-10 h-10 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                                    >
                                    <i class="far fa-heart"></i>
                                    </button>
                                </div>
                                <p
                                    id="planet-detail-description"
                                    class="text-slate-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base"
                                >${
                                  planetData.description ||
                                  `Explore the wonders of ${planetData.englishName}.`
                                }</p>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-2 md:gap-4 mt-4">
                                <div class="bg-slate-900/50 rounded-lg p-3 md:p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-1"><i class="fas fa-ruler text-xs"></i><span class="text-xs">Semimajor Axis</span></p>
                                <p id="planet-distance" class="text-sm md:text-lg font-semibold">${(
                                  planetData.semimajorAxis / 1_000_000
                                ).toFixed(1)}M km</p>
                                </div>
                                <div class="bg-slate-900/50 rounded-lg p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-1"><i class="fas fa-circle"></i>Mean Radius</p>
                                <p id="planet-radius" class="text-lg font-semibold">${planetData.meanRadius.toFixed()} km</p>
                                </div>
                                <div class="bg-slate-900/50 rounded-lg p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-1"><i class="fas fa-weight"></i>Mass</p>
                                <p id="planet-mass" class="text-lg font-semibold">${mass}</p>
                                </div>
                                <div class="bg-slate-900/50 rounded-lg p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-1"><i class="fas fa-compress"></i>Density</p>
                                <p id="planet-density" class="text-lg font-semibold">${planetData.density.toFixed(
                                  2
                                )} g/cm³</p>
                                </div>
                                <div class="bg-slate-900/50 rounded-lg p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-1"><i class="fas fa-sync-alt"></i>Orbital Period</p>
                                <p id="planet-orbital-period" class="text-lg font-semibold">${planetData.sideralOrbit.toFixed(
                                  2
                                )} days</p>
                                </div>
                                <div class="bg-slate-900/50 rounded-lg p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-1"><i class="fas fa-redo"></i>Rotation Period</p>
                                <p id="planet-rotation" class="text-lg font-semibold">${Math.abs(
                                  planetData.sideralRotation
                                ).toFixed(2)} hours</p>
                                </div>
                                <div class="bg-slate-900/50 rounded-lg p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-1"><i class="fas fa-moon"></i>Moons</p>
                                <p id="planet-moons" class="text-lg font-semibold">${
                                  planetData.moons ? planetData.moons.length : 0
                                }</p>
                                </div>
                                <div class="bg-slate-900/50 rounded-lg p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-1"><i class="fas fa-arrows-alt-v"></i>Gravity</p>
                                <p id="planet-gravity" class="text-lg font-semibold">${planetData.gravity.toFixed(
                                  2
                                )} m/s²</p>
                                </div>
                            </div>
                            </div>
                            <div class="space-y-6">
                            <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                                <h4 class="font-semibold mb-4 flex items-center"><i class="fas fa-user-astronaut text-purple-400 mr-2"></i>Discovery Info</h4>
                                <div class="space-y-3 text-sm">
                                <div class="flex justify-between items-center py-2 border-b border-slate-700"><span class="text-slate-400">Discovered By</span><span id="planet-discoverer" class="font-semibold text-right">Known since antiquity</span></div>
                                <div class="flex justify-between items-center py-2 border-b border-slate-700"><span class="text-slate-400">Discovery Date</span><span id="planet-discovery-date" class="font-semibold">Ancient times</span></div>
                                <div class="flex justify-between items-center py-2 border-b border-slate-700"><span class="text-slate-400">Body Type</span><span id="planet-body-type" class="font-semibold">Planet</span></div>
                                <div class="flex justify-between items-center py-2"><span class="text-slate-400">Volume</span><span id="planet-volume" class="font-semibold">${vol}</span></div>
                                </div>
                            </div>
                            <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                                <h4 class="font-semibold mb-4 flex items-center"><i class="fas fa-lightbulb text-yellow-400 mr-2"></i>Quick Facts</h4>
                                <ul id="planet-facts" class="space-y-3 text-sm">
                                <li class="flex items-start"><i class="fas fa-check text-green-400 mt-1 mr-2"></i><span class="text-slate-300">Mass: ${
                                  planetData.mass.massValue
                                } × 10^${
            planetData.mass.massExponent
          } kg</span></li>
                                <li class="flex items-start"><i class="fas fa-check text-green-400 mt-1 mr-2"></i><span class="text-slate-300">Surface gravity: ${
                                  planetData.gravity
                                } m/s²</span></li>
                                <li class="flex items-start"><i class="fas fa-check text-green-400 mt-1 mr-2"></i><span class="text-slate-300">Density: ${
                                  planetData.density
                                } g/cm³</span></li>
                                <li class="flex items-start"><i class="fas fa-check text-green-400 mt-1 mr-2"></i><span class="text-slate-300">Axial tilt: ${
                                  planetData.axialTilt
                                }°</span></li>
                                </ul>
                            </div>
                            <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                                <h4 class="font-semibold mb-4 flex items-center"><i class="fas fa-satellite text-blue-400 mr-2"></i>Orbital Characteristics</h4>
                                <div class="space-y-3 text-sm">
                                <div class="flex justify-between items-center py-2 border-b border-slate-700"><span class="text-slate-400">Perihelion</span><span id="planet-perihelion" class="font-semibold">${(
                                  planetData.perihelion / 1_000_000
                                ).toFixed(1)}M km</span></div>
                                <div class="flex justify-between items-center py-2 border-b border-slate-700"><span class="text-slate-400">Aphelion</span><span id="planet-aphelion" class="font-semibold">${(
                                  planetData.aphelion / 1_000_000
                                ).toFixed(1)}M km</span></div>
                                <div class="flex justify-between items-center py-2 border-b border-slate-700"><span class="text-slate-400">Eccentricity</span><span id="planet-eccentricity" class="font-semibold">${planetData.eccentricity.toFixed(
                                  5
                                )}</span></div>
                                <div class="flex justify-between items-center py-2 border-b border-slate-700"><span class="text-slate-400">Inclination</span><span id="planet-inclination" class="font-semibold">${
                                  planetData.inclination === 0
                                    ? "N/A"
                                    : planetData.inclination + "°"
                                }</span></div>
                                <div class="flex justify-between items-center py-2 border-b border-slate-700"><span class="text-slate-400">Axial Tilt</span><span id="planet-axial-tilt" class="font-semibold">${planetData.axialTilt.toFixed(
                                  2
                                )}°</span></div>
                                <div class="flex justify-between items-center py-2 border-b border-slate-700"><span class="text-slate-400">Avg Temperature</span><span id="planet-temp" class="font-semibold">${
                                  planetData.avgTemp
                                }°C</span></div>
                                <div class="flex justify-between items-center py-2"><span class="text-slate-400">Escape Velocity</span><span id="planet-escape" class="font-semibold">${(
                                  planetData.escape / 1000
                                ).toFixed(2)} Km/s</span></div>
                                </div>
                            </div>
                            <button class="w-full py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors font-semibold"><i class="fas fa-book mr-2"></i>Learn More</button>
                            </div>`;
        }
document
  .getElementById("sidebar-toggle")
  .addEventListener("click", function (e) {
    openSideMenu();
  });
function closeSideMenu() {
  document.getElementById("sidebar").classList.remove("sidebar-open");
  document.querySelector(".sidebar-overlay").classList.add("hidden");
}
function openSideMenu() {
  document.getElementById("sidebar").classList.add("sidebar-open");
  document.querySelector(".sidebar-overlay").classList.remove("hidden");
}
document.addEventListener("click", function () {
  document.addEventListener("click", function (e) {
    e.stopPropagation();
    if (
      !document.getElementById("sidebar-toggle").contains(e.target) &&
      !document.getElementById("sidebar").contains(e.target)
    ) {
      closeSideMenu();
    }
  });
});

function displayUpcomingLunches(UpComingData) {
  let AllUpComingLunches = UpComingData.slice(1);
  let dateDisplay = new Date(UpComingData[0].net).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  let customDate = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(UpComingData[0].net));
  document.getElementById("featured-launch").innerHTML = `  <div
              class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all"
            >
              <div
                class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
              <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                <div class="flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-3 mb-4">
                      <span
                        class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2"
                      >
                        <i class="fas fa-star"></i>
                        Featured Launch
                      </span>
                      <span
                        class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold"
                      >
                        ${UpComingData[0].status.abbrev}
                      </span>
                    </div>
                    <h3 class="text-3xl font-bold mb-3 leading-tight">
                      ${UpComingData[0].rocket.configuration.name}
                    </h3>
                    <div
                      class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400"
                    >
                      <div class="flex items-center gap-2">
                        <i class="fas fa-building"></i>
                        <span>${UpComingData[0].launch_service_provider.name}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <i class="fas fa-rocket"></i>
                        <span>${UpComingData[0].rocket.configuration.name}</span>
                      </div>
                    </div>
                    <div
                      class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6"
                    >
                      <i class="fas fa-clock text-2xl text-blue-400"></i>
                      <div>
                        <p class="text-2xl font-bold text-blue-400">2</p>
                        <p class="text-xs text-slate-400">Days Until Launch</p>
                      </div>
                    </div>
                    <div class="grid xl:grid-cols-2 gap-4 mb-6">
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-calendar"></i>
                          Launch Date
                        </p>
                        <p class="font-semibold">${dateDisplay}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-clock"></i>
                          Launch Time
                        </p>
                        <p class="font-semibold">${customDate}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-map-marker-alt"></i>
                          Location
                        </p>
                        <p class="font-semibold text-sm">${UpComingData[0].pad.location.name}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-globe"></i>
                          Country
                        </p>
                        <p class="font-semibold">${UpComingData[0].pad.location.country.name}</p>
                      </div>
                    </div>
                    <p class="text-slate-300 leading-relaxed mb-6">
                      ${UpComingData[0].mission.description}
                    </p>
                  </div>
                  <div class="flex flex-col md:flex-row gap-3">
                    <button
                      class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <i class="fas fa-info-circle"></i>
                      View Full Details
                    </button>
                    <div class="icons self-end md:self-center">
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="far fa-heart"></i>
                      </button>
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="fas fa-bell"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="relative">
                  <div
                    class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50"
                  >
                  <img src="${UpComingData[0].image.image_url}" alt="${UpComingData[0].name}" class="w-full h-full object-cover" ">
                    <!-- Placeholder image/icon since we can't load external images reliably without correct URLs -->
                    <div
                      class="flex items-center justify-center h-full min-h-[400px] bg-slate-800"
                    >
                      <i class="fas fa-rocket text-9xl text-slate-700/50"></i>
                    </div>
                    <div
                      class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"
                    ></div>
                  </div>
                </div>
              </div>
            </div>`;
  let LunchesBox = "";
  for (let i = 0; i < AllUpComingLunches.length; i++) {
    let launchDate = new Date(AllUpComingLunches[i].net);
    let dateString = launchDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    let timeString =
      launchDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) + " UTC";
    LunchesBox += `       
   <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
       
       <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
           <!-- Rocket Icon or Image -->
           ${
             AllUpComingLunches[i].image &&
             AllUpComingLunches[i].image.image_url
               ? `<img src="${AllUpComingLunches[i].image.image_url}" class="absolute inset-0 w-full h-full object-cover opacity-60">`
               : `<i class="fas fa-space-shuttle text-5xl text-slate-700"></i>`
           }
           
           <div class="absolute top-3 right-3">
             <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
               ${
                 AllUpComingLunches[i].status
                   ? AllUpComingLunches[i].status.abbrev
                   : "Go"
               }
             </span>
           </div>
       </div>
       <div class="p-5">
           <div class="mb-3">
             <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
               ${AllUpComingLunches[i].rocket.configuration.name}
             </h4>
             <p class="text-sm text-slate-400 flex items-center gap-2">
               <i class="fas fa-building text-xs"></i>
               ${AllUpComingLunches[i].launch_service_provider.name}
             </p>
           </div>
           
           <div class="space-y-2 mb-4">
             <!-- Launch Date -->
             <div class="flex items-center gap-2 text-sm">
               <i class="fas fa-calendar text-slate-500 w-4"></i>
               <span class="text-slate-300">${dateString}</span>
             </div>
             
             <!-- Launch Time -->
             <div class="flex items-center gap-2 text-sm">
               <i class="fas fa-clock text-slate-500 w-4"></i>
               <span class="text-slate-300">${timeString}</span>
             </div>
             
             <!-- Rocket Name -->
             <div class="flex items-center gap-2 text-sm">
               <i class="fas fa-rocket text-slate-500 w-4"></i>
               <span class="text-slate-300">${
                 AllUpComingLunches[i].rocket.configuration.name
               }</span>
             </div>
             
             <!-- Location -->
             <div class="flex items-center gap-2 text-sm">
               <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
               <span class="text-slate-300 line-clamp-1">${
                 AllUpComingLunches[i].pad.location.name
               }</span>
             </div>
           </div>
           
           <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
             <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
               Details
             </button>
             <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
               <i class="far fa-heart"></i>
             </button>
           </div>
       </div>
   </div>
`;
  }
  document.getElementById("launches-grid").innerHTML = LunchesBox;
}
for (let i = 0; i < mySelectors.sectionsLinks.length; i++) {
  mySelectors.sectionsLinks[i].addEventListener("click", function (e) {
    e.preventDefault();

    displayActiveSection(this.dataset.section);
  });
}
mySelectors.dateInput.addEventListener("change", function (e) {
  mySelectors.dateInput.parentElement.lastElementChild.innerHTML = new Date(
    e.currentTarget.value
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});
mySelectors.dateInput.parentElement.nextElementSibling.addEventListener(
  "click",
  function () {
    GetTodayPic(mySelectors.dateInput.value);
  }
);
mySelectors.dateInput.parentElement.nextElementSibling.nextElementSibling.addEventListener(
  "click",
  function () {
    mySelectors.dateInput.value = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    mySelectors.dateInput.parentElement.lastElementChild.innerHTML =
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    GetTodayPic(mySelectors.todayDate);
  }
);
