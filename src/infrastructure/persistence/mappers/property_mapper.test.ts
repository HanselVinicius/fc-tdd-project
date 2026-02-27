import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { PropertyMapper } from "./property_mapper";

describe('PropertyMapper', () => {


  it("deve converter PropertyEntity em Property corretamente", () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = '1';
    propertyEntity.basePricePerNight = 100;
    propertyEntity.description = 'Desc';
    propertyEntity.maxGuests = 5;
    propertyEntity.name = 'Name';



    const property = PropertyMapper.toDomain(propertyEntity);

    expect(property).not.toBeNull();
    expect(property.getId()).toBe(propertyEntity.id);
    expect(property.getBasePricePerNight()).toBe(propertyEntity.basePricePerNight);
    expect(property.getDescription()).toBe(propertyEntity.description);
    expect(property.getMaxGuests()).toBe(propertyEntity.maxGuests);
    expect(property.getName()).toBe(propertyEntity.name);
  });


  it("deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity", () => {
    const propertyEntity = new PropertyEntity();

    expect(() => {
      PropertyMapper.toDomain(propertyEntity);
    }).toThrow(new Error("O nome é obrigatório"));
  });


  it("deve converter Property para PropertyEntity corretamente", () => {
    const property = new Property(
      '1',
      'name',
      'desc',
      5,
      100
    );

    const propertyEntity = PropertyMapper.toPersistence(property);


    expect(propertyEntity).not.toBeNull();
    expect(propertyEntity.id).toBe(property.getId());
    expect(propertyEntity.basePricePerNight).toBe(property.getBasePricePerNight());
    expect(propertyEntity.description).toBe(property.getDescription());
    expect(propertyEntity.maxGuests).toBe(property.getMaxGuests());
    expect(propertyEntity.name).toBe(property.getName());
  });


});
