import { initializeSidebar } from '@/sidebar';
import { AdsController } from '../controllers/home';
import { AdsView } from '../views/home';
import { AdsModel } from '../models/home';

const homePage = () => {
  new AdsController(new AdsModel(), new AdsView());
};

homePage();
initializeSidebar();
