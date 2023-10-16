import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
//import { PassThrough } from 'stream';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    //ça va generate le password
    const hash = await argon.hash(dto.password);
    //save user (new) in db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete user.hash;
      //return saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Creds already taken !');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // Find the user with the email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user =/ not exist --> throw exeption
    if (!user) throw new ForbiddenException('Wrong creds !');

    // if user exist --> compare the password
    const pwMatches = await argon.verify(user.hash, dto.password);

    // if password =/ not match --> throw exeption
    if (!pwMatches)
      throw new ForbiddenException('Wrong creds !');
    // if password match --> return user
    return { msg: 'I have sign in' };
  }
}
