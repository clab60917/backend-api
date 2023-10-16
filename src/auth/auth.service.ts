import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
//import { PassThrough } from 'stream';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    //ça va generate le password
    const hash = await argon.hash(dto.password);
    //save user (new) in db
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
    });

    delete user.hash;

    //return saved user
    return user;
  }

  signin() {
    return { msg: 'I have sign in' };
  }
}
