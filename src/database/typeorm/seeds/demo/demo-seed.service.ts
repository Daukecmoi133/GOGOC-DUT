import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Demo } from 'src/database/typeorm/entities/demo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DemoSeedService {
  constructor(
    @InjectRepository(Demo)
    private repository: Repository<Demo>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(this.repository.create({}));
    }
  }
}
