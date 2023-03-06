import { AbstractView } from "../../common/view.js";
import { FAVORITES_VIEW_TITLE } from "../../constants/titles.js";
import { appStateKeys } from "../../constants/stateKeys.js";
import { HeaderComponent } from "../../components/Header/Header.js";
import onChange from "on-change";
import { PageTitle } from "../../components/PageTitle/PageTitle.js";
import { routes } from "../../constants/index.js";
import { createMainContentBlock } from "../../utils/createMainContentBlock.js";
import { CardsBlock } from "../../components/CardsBlock/CardsBlock.js";
import './Favorites.css';

export class Favorites extends AbstractView {
  #appState; #mainContentBlock;

  constructor(appState) {
    super();
    this.#appState = appState;
    this.#appState = onChange(this.#appState, this.#handleAppStateChange);
    this.setTitle(FAVORITES_VIEW_TITLE);
  }

  #handleAppStateChange = (path) => {
    if (path === appStateKeys.FAVORITES) {
      this.render();
    }

    if (path === appStateKeys.SELECTED_CARD) {
      this.redirectTo(`${routes.details}${this.#appState[appStateKeys.SELECTED_CARD].key.replace('works/', '')}`);
    }
  }

  #renderHeader() {
    const header = new HeaderComponent(this.#appState[appStateKeys.FAVORITES].size).generate();
    this.appContentWrapper.appendChild(header);
  }

  #renderContent() {
    const pageTitle = new PageTitle('Избранное').generate();
    const cardsBlock = new CardsBlock({
      appState: this.#appState,
      cardsSet: this.#appState[appStateKeys.FAVORITES],
    }).generate();

    const mainContentBlockElements = [pageTitle, cardsBlock];

    this.#mainContentBlock = createMainContentBlock(mainContentBlockElements);

    this.appContentWrapper.appendChild(this.#mainContentBlock);
  }

  render() {
    super.render();
    this.#renderHeader();
    this.#renderContent();
    this.appRootContainer.appendChild(this.appContentWrapper);
  }

  destroy() {
    super.destroy();
    onChange.unsubscribe(this.#appState);
  }
}
