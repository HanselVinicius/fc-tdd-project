import { CreateUserDto } from "../../application/dtos/create_user_dto";
import { UserService } from "../../application/services/user_service";
import { Request, Response } from "express";

export class UserController {

    constructor(private readonly userService: UserService) { }


    public async createUser(req: Request, res: Response) {
        try {
            const name = req.body.name;
            if (!name) {
                return res
                    .status(400)
                    .json({ message: "O campo nome é obrigatório." });
            }

            const createUserDto: CreateUserDto = {
                name: name
            };
            const user = await this.userService.createUser(createUserDto);
            return res.status(201)
                .json({
                    message: "Usuario Criado com Sucesso.",
                    user: {
                        id: user.getId(),
                        name: user.getName()
                    }
                });
        } catch (err) {
            res.status(500)
                .json({
                    message: "Erro inesperado."
                });
        }
    }


}