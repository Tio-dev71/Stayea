import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateBlogDto {
  @ApiProperty({ example: "Cẩm Nang Du Lịch Phú Quốc Tự Túc Từ A Đến Z 2026" })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: "### Phú Quốc mùa nào đẹp nhất?..." })
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiPropertyOptional({ example: "cam-nang", description: "cam-nang, diem-den, am-thuc, luu-tru, trai-nghiem, kinh-nghiem-xe" })
  @IsString()
  @IsOptional()
  category?: string

  @ApiPropertyOptional({ example: "https://images.unsplash.com/photo-1544551763-46a013bb70d5" })
  @IsString()
  @IsOptional()
  imageUrl?: string

  @ApiPropertyOptional({ type: [String], example: ["PhuQuoc", "CamNang", "Homestay"] })
  @IsArray()
  @IsOptional()
  tags?: string[]

  @ApiPropertyOptional({ example: "Ban Quản Trị STAYEA" })
  @IsString()
  @IsOptional()
  author?: string

  @ApiPropertyOptional({ example: "ptn_07f9ab3269b5" })
  @IsString()
  @IsOptional()
  partnerId?: string

  @ApiPropertyOptional({ enum: ["draft", "published", "archived"], example: "published" })
  @IsEnum(["draft", "published", "archived"])
  @IsOptional()
  status?: "draft" | "published" | "archived"

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isPinned?: boolean
}

export class UpdateBlogDto {
  @ApiPropertyOptional({ example: "Tiêu đề bài viết cập nhật" })
  @IsString()
  @IsOptional()
  title?: string

  @ApiPropertyOptional({ example: "Nội dung bài viết mới..." })
  @IsString()
  @IsOptional()
  content?: string

  @ApiPropertyOptional({ example: "am-thuc" })
  @IsString()
  @IsOptional()
  category?: string

  @ApiPropertyOptional({ example: "https://images.unsplash.com/..." })
  @IsString()
  @IsOptional()
  imageUrl?: string

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[]

  @ApiPropertyOptional({ example: "Tác giả mới" })
  @IsString()
  @IsOptional()
  author?: string

  @ApiPropertyOptional({ enum: ["draft", "published", "archived"] })
  @IsEnum(["draft", "published", "archived"])
  @IsOptional()
  status?: "draft" | "published" | "archived"

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isPinned?: boolean
}
