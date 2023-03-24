import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: {
    email: string;
    displayName: string;
    password: string;
  }): Promise<User> {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        email: data.email,
        displayname: data.displayName,
        password: hashedPassword,
      },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);

    if (!user) {
      return null;
    }

    // Check if the provided password matches the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
