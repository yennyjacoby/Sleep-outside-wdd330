export default class Alert {
  constructor() {
    // Create the section
    const section = document.createElement("section");
    section.classList.add("alert-list");

    // Fetch the alerts
    fetch("/json/alerts.json")
      .then((response) => response.json())
      .then((data) => {
        // Loop through each alert
        data.forEach((alert) => {
          // Create paragraph
          const paragraph = document.createElement("p");

          paragraph.textContent = alert.message;
          paragraph.style.backgroundColor = alert.background;
          paragraph.style.color = alert.color;

          section.appendChild(paragraph);
        });

        // Add section to the page after all alerts are built
        const mainElement = document.querySelector("main");
        mainElement.prepend(section);
      });
  }
}