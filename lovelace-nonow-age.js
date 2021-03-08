import {
  css,
  html,
  LitElement,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";
import dayjs from "https://unpkg.com/dayjs@1.8.24/esm/index.js?module";
import localizedFormat from "https://unpkg.com/dayjs@1.8.24/esm/plugin/localizedFormat/index.js";
import relativeTime from "https://unpkg.com/dayjs@1.8.24/esm/plugin/relativeTime/index.js";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

class NonowAge extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  render() {
    const date = dayjs(this.hass.states[this.config.entity].state);
    const now = dayjs();

    const years = `${Math.floor(now.diff(date, "year"))}`.padStart(2, "0");
    const month = `${Math.floor(
      now.diff(date.add(years, "year"), "month")
    )}`.padStart(2, "0");

    const days = `${Math.floor(
      now.diff(date.add(years, "year").add(month, "month"), "day")
    )}`.padStart(2, "0");
    const hours = `${Math.floor(
      now.diff(
        date.add(years, "year").add(month, "month").add(days, "day"),
        "hour"
      )
    )}`.padStart(2, "0");
    const minutes = `${Math.floor(
      now.diff(
        date
          .add(years, "year")
          .add(month, "month")
          .add(days, "day")
          .add(hours, "hour"),
        "minute"
      )
    )}`.padStart(2, "0");
    const absoluteMonth = `${Math.floor(now.diff(date, "month"))}`.padStart(
      2,
      "0"
    );
    const absoluteDays = `${Math.floor(now.diff(date, "day"))}`.padStart(
      2,
      "0"
    );

    const yearString =
      years > 1
        ? html`<div class="figure-sentence">
            <span class="figure">${years}</span> ans
          </div>`
        : years > 0
        ? html`<div class="figure-sentence">
            <span class="figure">1</span> an
          </div>`
        : "";
    const monthString =
      month > 0
        ? html`<div class="figure-sentence">
            <span class="figure">${month}</span> mois
          </div>`
        : "";
    const dayString =
      days > 1
        ? html`<div class="figure-sentence">
            <span class="figure">${days}</span> jours
          </div>`
        : days > 0
        ? html`<div class="figure-sentence">
            <span class="figure">1</span> jour
          </div>`
        : "";
    const hourString =
      hours > 1
        ? html`<div class="figure-sentence">
            <span class="figure">${hours}</span> heures
          </div>`
        : hours > 0
        ? html`<div class="figure-sentence">
            <span class="figure">1</span> heure
          </div>`
        : "";
    const minuteString =
      minutes > 1
        ? html`<div class="figure-sentence">
            <span class="figure">${minutes}</span> minutes
          </div>`
        : minutes > 0
        ? html`<div class="figure-sentence">
            <span class="figure">1</span> minute
          </div>`
        : "";

    const absoluteMonthString =
      years > 1 && absoluteMonth > 0
        ? html`<div class="figure-absolute-content">
            <div class="figure-sentence">
              <span class="figure">${absoluteMonth}</span> mois ${dayString}
            </div>
          </div>`
        : "";
    const absoluteDayString =
      month > 1 && absoluteDays > 1
        ? html`<div class="figure-absolute-content">
            <div class="figure-sentence">
              <span class="figure">${absoluteDays}</span> jours
            </div>
          </div>`
        : absoluteDays > 0
        ? html`<div class="figure-absolute-content">
            <div class="figure-sentence">
              <span class="figure">1</span> jour
            </div>
          </div>`
        : "";

    return html`
      <ha-card header="${this.config.title ?? "Age"}">
        <div class="content">
          ${yearString} ${monthString} ${dayString} ${hourString}
          ${minuteString} ${absoluteMonthString} ${absoluteDayString}
        </div>
      </ha-card>
    `;
  }

  setConfig(config) {
    const { entity, title } = config;

    if (!entity) {
      throw new Error("You must define an entity");
    }

    this.config = { entity, title };
  }

  static get styles() {
    return css`
      ha-card {
        padding: 0 6px;
      }
      .content {
        padding: 0 24px 24px 24px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        font-size: 25px;
      }
      .figure-sentence {
        font-weight: 300;
        font-size: 1em;
        display: flex;
        align-items: center;
        margin: 0.16em 0.32em 0.16em 0.16em;
      }
      .figure {
        line-height: 1em;
        font-size: 1.6em;
        font-weight: 500;
        margin: 0 0.16em;
      }
      .figure-absolute-content {
        border-top: 1px solid var(--background-color);
        margin-top: 16px;
        padding-top: 16px;
        width: 100%;
        font-size: 0.5em;
        display: flex;
        line-height: initial;
        align-items: flex-end;
        justify-content: center;
      }
    `;
  }
}

customElements.define("lovelace-nonow-age", NonowAge);
