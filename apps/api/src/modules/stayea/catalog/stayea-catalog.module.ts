import { Module } from "@nestjs/common"

import { StayeaAccommodationsController } from "@/modules/stayea/catalog/stayea-accommodations.controller"
import { StayeaCatalogService } from "@/modules/stayea/catalog/stayea-catalog.service"
import { StayeaDealsController } from "@/modules/stayea/catalog/stayea-deals.controller"
import { StayeaExperiencesController } from "@/modules/stayea/catalog/stayea-experiences.controller"
import { StayeaFlightsController } from "@/modules/stayea/catalog/stayea-flights.controller"
import { StayeaPackagesController } from "@/modules/stayea/catalog/stayea-packages.controller"

@Module({
  controllers: [
    StayeaAccommodationsController,
    StayeaExperiencesController,
    StayeaPackagesController,
    StayeaFlightsController,
    StayeaDealsController,
  ],
  providers: [StayeaCatalogService],
  exports: [StayeaCatalogService],
})
export class StayeaCatalogModule {}
