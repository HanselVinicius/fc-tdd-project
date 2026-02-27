import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/property_repository";
import { CreatePropertyDto } from "../dtos/create_property_dto";
import { v4 as uuidv4 } from "uuid";

export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) { }

  public async findPropertyById(id: string): Promise<Property | null> {
    return this.propertyRepository.findById(id);
  }

  public async createProperty(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const property = new Property(
      uuidv4(),
      createPropertyDto.name,
      createPropertyDto.description,
      createPropertyDto.maxGuests,
      createPropertyDto.basePricePerNight
    );

    await this.propertyRepository.save(property);

    return property;
  }

}
