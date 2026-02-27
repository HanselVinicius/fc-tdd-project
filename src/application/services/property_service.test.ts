import { PropertyService } from "./property_service";
import { FakePropertyRepository } from "../../infrastructure/repositories/fake_property_repository";
import { Property } from "../../domain/entities/property";
import { CreatePropertyDto } from "../dtos/create_property_dto"

describe("PropertyService", () => {
  let propertyService: PropertyService;
  let fakePropertyRepository: FakePropertyRepository;

  beforeEach(() => {
    fakePropertyRepository = new FakePropertyRepository();
    propertyService = new PropertyService(fakePropertyRepository);
  });

  it("deve retornar null quando um ID inválido for passado", async () => {
    const property = await propertyService.findPropertyById("999");
    expect(property).toBeNull();
  });

  it("deve retornar uma propriedade quando um ID váilido for fornecido", async () => {
    const property = await propertyService.findPropertyById("1");
    expect(property).not.toBeNull();
    expect(property?.getId()).toBe("1");
    expect(property?.getName()).toBe("Apartamento");
  });

  it("deve salvar uma nova propriedade com sucesso usando repositorio fake e buscando novamente", async () => {
    const newProperty = new Property(
      "3",
      "Test Property",
      "Test Description",
      4,
      100
    );
    await fakePropertyRepository.save(newProperty);

    const property = await propertyService.findPropertyById("3");
    expect(property).not.toBeNull();
    expect(property?.getId()).toBe("3");
    expect(property?.getName()).toBe("Test Property");
  });

  it("deve criar uma propriedade com sucesso", async () => {
    const dto: CreatePropertyDto = {
      basePricePerNight: 100,
      description: 'desc',
      maxGuests: 5,
      name: "Name"
    };

    const property = await propertyService.createProperty(dto);
    expect(property).not.toBeNull();
    expect(property.getName()).toBe(dto.name);
    expect(property.getDescription()).toBe(dto.description);
    expect(property.getMaxGuests()).toBe(dto.maxGuests);
    expect(property.getBasePricePerNight()).toBe(dto.basePricePerNight);
  });


  it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
    const dto: CreatePropertyDto = {
      basePricePerNight: 100,
      description: 'desc',
      maxGuests: 5,
      name: ""
    };

    expect(
      async () => {
        await propertyService.createProperty(dto);
      }).rejects.toThrow(new Error("O nome é obrigatório"));
  });

  it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", () => {
    const dto: CreatePropertyDto = {
      basePricePerNight: 100,
      description: 'desc',
      maxGuests: 0,
      name: "Name"
    };

    expect(
      async () => {
        await propertyService.createProperty(dto);
      }).rejects.toThrow(new Error("O número máximo de hóspedes deve ser maior que zero"));
  });

});
