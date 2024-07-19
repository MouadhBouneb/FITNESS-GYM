import { User } from 'src/modules/user/user.entity';

export class ResponseLogin {
  constructor(message: string, data: User, status?: boolean) {
    this.message = message;
    this.data = data;
    this.status = status;
  }
  status: boolean = true;
  message: string;
  data: User;
}
