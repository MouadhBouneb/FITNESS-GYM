import { ApiProperty } from '@nestjs/swagger';

export class GlobalResponseArray {
  @ApiProperty()
  status: boolean = true;
  @ApiProperty()
  message: string;
  @ApiProperty()
  data: any[];
  @ApiProperty()
  count: number;
  constructor(data: any[], message: string, count: number, status: boolean = true) {
    this.status = status;
    this.data = data;
    this.message = message;
    this.count = count;
  }
}
export class GlobalResponse {
  @ApiProperty()
  status: boolean = true;
  @ApiProperty()
  message: string;
  @ApiProperty()
  data: any;
  constructor(data: any, message: string, status: boolean = true) {
    this.status = status;
    this.data = data;
    this.message = message;
  }
}
