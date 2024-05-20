import { AdsModel } from '../models/home';
import { AdsView } from '../views/home';

/**
 * Represents the AdsController class for handling the business logic and user interactions.
 */
export class AdsController {
  model: AdsModel;
  view: AdsView;

  constructor(model: AdsModel, view: AdsView) {
    this.model = model;
    this.view = view;
    this.initialize();
  }

  /**
   * Initializes the AdsController and fetches the initial data.
   */
  async initialize(): Promise<void> {
    const data = await this.model.fetchAdsData();

    if (data) {
      this.view.displayAdsList(data);
    }
  }
}
