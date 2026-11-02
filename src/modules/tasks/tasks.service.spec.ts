import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from '../../database/typeorm/entities/task.entity';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let repository: jest.Mocked<
    Pick<Repository<Task>, 'create' | 'find' | 'findOne' | 'remove' | 'save'>
  >;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      save: jest.fn(),
    };
    service = new TasksService(repository as unknown as Repository<Task>);
  });

  it('creates a task using the provided fields', async () => {
    const dto = { title: 'Learn NestJS' };
    const task = { id: 1, ...dto } as Task;
    repository.create.mockReturnValue(task);
    repository.save.mockResolvedValue(task);

    await expect(service.create(dto)).resolves.toBe(task);
    expect(repository.create).toHaveBeenCalledWith(dto);
  });

  it('filters tasks by completion state and category', async () => {
    const query = { isCompleted: false, category: 'Backend' };
    repository.find.mockResolvedValue([]);

    await service.findAll(query);

    expect(repository.find).toHaveBeenCalledWith({
      where: query,
      order: { createdAt: 'DESC' },
    });
  });

  it('throws NotFoundException when a task does not exist', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne(404)).rejects.toThrow(
      new NotFoundException('Tasks with ID 404 not found'),
    );
  });

  it('updates and saves an existing task', async () => {
    const task = { id: 1, title: 'Old title' } as Task;
    repository.findOne.mockResolvedValue(task);
    repository.save.mockResolvedValue(task);

    await service.update(1, { title: 'New title' });

    expect(task.title).toBe('New title');
    expect(repository.save).toHaveBeenCalledWith(task);
  });

  it('removes an existing task', async () => {
    const task = { id: 1, title: 'Learn NestJS' } as Task;
    repository.findOne.mockResolvedValue(task);
    repository.remove.mockResolvedValue(task);

    await service.remove(1);

    expect(repository.remove).toHaveBeenCalledWith(task);
  });
});
