import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";
import { UserService } from "../../application/services/user_service";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { UserEntity } from "../persistence/entities/user_entity";
import {UserController} from "./user_controller"
const app = express();
app.use(express.json());

let dataSource: DataSource;
let userRepository: TypeORMUserRepository;
let userService: UserService;
let userController: UserController;

beforeAll(async () => {
    dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [BookingEntity, PropertyEntity, UserEntity],
        synchronize: true,
        logging: false,
    });

    await dataSource.initialize();

    userRepository = new TypeORMUserRepository(
        dataSource.getRepository(UserEntity)
    );
    userService = new UserService(userRepository);

    userController = new UserController(userService);

    app.post("/users", (req, res, next) => {
        userController.createUser(req, res);
    });

});

afterAll(async () => {
    await dataSource.destroy();
});

describe('UserController', () => {

    beforeAll(async () => {
        const propertyRepo = dataSource.getRepository(PropertyEntity);
        const userRepo = dataSource.getRepository(UserEntity);
        const bookingRepo = dataSource.getRepository(BookingEntity);

        await bookingRepo.clear();
        await propertyRepo.clear();
        await userRepo.clear();
    });


    it("deve criar um usuário com sucesso", async () => {
        const response = await request(app).post("/users").send({
            name: 'userName'
        });

        expect(response).not.toBeNull();
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Usuario Criado com Sucesso.");
        expect(response.body.user.id).toBeDefined();
        expect(response.body.user.name).toBe("userName");
    });

    it("deve retornar erro com código 400 e mensagem 'O campo nome é obrigatório.' ao enviar um nome vazio", async () => {
        const response = await request(app).post("/users").send({
            name: null
        });

        expect(response).not.toBeNull();
        expect(response.body.message).toBe("O campo nome é obrigatório.");
    });



});
