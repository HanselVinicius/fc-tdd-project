import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { UserEntity } from "../persistence/entities/user_entity";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { PropertyService } from "../../application/services/property_service";
import { PropertyController } from "./property_controller"

const app = express();
app.use(express.json());

let dataSource: DataSource;
let propertyRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyController;

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

    propertyRepository = new TypeORMPropertyRepository(
        dataSource.getRepository(PropertyEntity)
    );
    propertyService = new PropertyService(propertyRepository);

    propertyController = new PropertyController(propertyService);

    app.post("/propertys", (req, res, next) => {
        propertyController.createProperty(req, res);
    });

});

afterAll(async () => {
    await dataSource.destroy();
});



describe('PropertyController', () => {

    beforeAll(async () => {
        const propertyRepo = dataSource.getRepository(PropertyEntity);
        await propertyRepo.clear();
    });

    it("deve criar uma propriedade com sucesso", async () => {
        const response = await request(app).post("/propertys").send({
            name: "string",
            description: "string",
            maxGuests: 5,
            basePricePerNight: 100
        });

        expect(response).not.toBeNull();
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Propriedade Criada com sucesso");
        expect(response.body.property.id).toBeDefined();
        expect(response.body.property.name).toBe("string");
        expect(response.body.property.description).toBe("string");
        expect(response.body.property.maxGuests).toBe(5);
        expect(response.body.property.basePricePerNight).toBe(100);

    });

    it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
        const response = await request(app).post("/propertys").send({
            name: "",
            description: "string",
            maxGuests: 5,
            basePricePerNight: 100
        });

        expect(response).not.toBeNull();
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("O nome da propriedade é obrigatório.");
    });


    it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
        const response = await request(app).post("/propertys").send({
            name: "string",
            description: "string",
            maxGuests: 5
        });

        expect(response).not.toBeNull();
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("O preço base por noite é obrigatório.");
    });

    it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {
        const response = await request(app).post("/propertys").send({
            name: "string",
            description: "string",
            maxGuests: 0,
            basePricePerNight: 100
        });

        expect(response).not.toBeNull();
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("A capacidade máxima deve ser maior que zero.");
    });






});