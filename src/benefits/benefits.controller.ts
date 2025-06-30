import { Controller, Get } from '@nestjs/common';
import { BenefitsService } from '@benefits/benefits.service';

@Controller('benefits')
export class BenefitsController {
  constructor(private benefitsService: BenefitsService) {}

  @Get('/automatic')
  async createAutomaticBenefits() {
    return await this.benefitsService.createAutomaticBenefitForFrequentVisitors();
  }
}
