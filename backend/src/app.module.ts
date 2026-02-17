import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { AcademyModule } from './academy/academy.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { TechStacksModule } from './tech-stacks/tech-stacks.module';
import { LandingSectionsModule } from './landing-sections/landing-sections.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { MediaModule } from './media/media.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    AcademyModule,
    ProductsModule,
    CategoriesModule,
    TechStacksModule,
    LandingSectionsModule,
    SiteSettingsModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
