import { Actors } from '@/entities/Actors';
import { ActorTypes } from '@/entities/ActorTypes';
import { Companies } from '@/entities/Companies';
import { Users } from '@/entities/Users';
import { SystemRoles } from '@/web_auth/interfaces';
import { EntityManager } from '@mikro-orm/postgresql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcrypt';
import { CreateUserDto } from './dto/create.dto';

@Injectable()
export class UserService {
  constructor(protected readonly em: EntityManager) {}

  async create(user: Partial<CreateUserDto>) {
    const _user = await this.em.findOne(Users, { email: user.email });
    if (_user) {
      throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);
    }

    const _company = await this.em.findOne(Companies, { title: user.company });
    if (_company) {
      throw new HttpException('Компания с таким названием не существует', HttpStatus.BAD_REQUEST);
    }

    const newCompany = new Companies();
    newCompany.title = user.company;
    await this.em.persist(newCompany).flush();

    const actorUserType = await this.em.findOne(ActorTypes, { title: 'User' });
    const newActor = new Actors();
    newActor.company = newCompany;
    newActor.type = actorUserType;
    await this.em.persist(newActor).flush();

    const hashedPassword = user?.password ? this.hashPassword(user.password) : null;

    const newUser = new Users();

    newUser.actor = newActor;
    newUser.login = user?.email;
    newUser.email = user?.email;
    newUser.role = SystemRoles.User;
    newUser.pwdHash = hashedPassword;
    newUser.created = new Date();
    newUser.company = newCompany;

    await this.em.persist(newUser).flush();

    return newUser;
  }
  async update(uuid: string, user: Partial<any>) {
    const hashedPassword = user?.password ? this.hashPassword(user.password) : null;

    const _user = await this.em.findOne(Users, { email: user.email });
    if (_user) {
      throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);
    }

    _user.login = user?.email ?? undefined;
    _user.email = user?.email ?? undefined;
    _user.pwdHash = hashedPassword;
    _user.is_active = user?.is_active ?? undefined;
    _user.first_name = user?.first_name ?? undefined;
    _user.last_name = user?.last_name ?? undefined;

    await this.em.flush();
  }

  async findOne(email: string): Promise<any> {
    return await this.em.findOne(Users, {
      email: email,
    });
  }

  async delete(id: number, user: any) {
    if (user.id !== id) {
      throw new Error('Вы можете удалить только свой аккаунт');
    }
    const removeUser = await this.em.findOne(Users, { id: 1 });
    return this.em.remove(removeUser).flush();
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
