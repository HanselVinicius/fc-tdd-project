import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user_repository";
import { CreateUserDto } from "../dtos/create_user_dto";
import { v4 as uuidv4 } from "uuid";

export class UserService {
  constructor(private readonly userRepository: UserRepository) { }
  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = new User(uuidv4(), createUserDto.name);
    await this.userRepository.save(user);
    return user;
  }

}
