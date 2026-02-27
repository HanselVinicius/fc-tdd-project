import { CreatePropertyDto } from "../../application/dtos/create_property_dto";
import { PropertyService } from "../../application/services/property_service";
import { Request, Response } from "express";

export class PropertyController {

    constructor(
        private readonly propertyService: PropertyService
    ) { }


    public async createProperty(req: Request, res: Response) {
        try {

            const name = req.body.name;
            const maxGuests = req.body.maxGuests;
            const basePricePerNight = req.body.basePricePerNight;

            if (!name) {
                return res.status(400).json({
                    message: "O nome da propriedade é obrigatório."
                });
            }

            if (!maxGuests) {
                return res.status(400).json({
                    message: "A capacidade máxima deve ser maior que zero."
                });
            }

            if (!basePricePerNight) {
                return res.status(400).json({
                    message: "O preço base por noite é obrigatório."
                });
            }

            const dto: CreatePropertyDto = {
                name: name,
                basePricePerNight: basePricePerNight,
                description: req.body.description,
                maxGuests: maxGuests
            }
            const property = await this.propertyService.createProperty(dto);
            return res.status(201).json({
                message: "Propriedade Criada com sucesso",
                property: {
                    id: property.getId(),
                    name: property.getName(),
                    basePricePerNight: property.getBasePricePerNight(),
                    description: property.getDescription(),
                    maxGuests: property.getMaxGuests()
                }
            });
        } catch (err) {
            res.status(500).json({
                message: "Erro inesperado."
            });
        }

    }

}