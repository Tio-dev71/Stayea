import { Module } from "@nestjs/common"

import { StayeaUserController } from "@/modules/stayea/user/stayea-user.controller"
import { StayeaUserService } from "@/modules/stayea/user/stayea-user.service"

@Module({
  controllers: [StayeaUserController],
  providers: [StayeaUserService],
  exports: [StayeaUserService],
})
export class StayeaUserModule {}
