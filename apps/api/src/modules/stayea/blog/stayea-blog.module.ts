import { Module } from "@nestjs/common"

import { StayeaBlogController } from "@/modules/stayea/blog/stayea-blog.controller"
import { StayeaBlogService } from "@/modules/stayea/blog/stayea-blog.service"

@Module({
  controllers: [StayeaBlogController],
  providers: [StayeaBlogService],
  exports: [StayeaBlogService],
})
export class StayeaBlogModule {}
