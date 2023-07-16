import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContactService } from './contact.service';
import { IdentifyContactDto } from './dto/identify-contact.dto';


@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // API endpoint for identifying user
  @Post('/identify')
  identify(@Body() identifyContactDto: IdentifyContactDto) {
    return this.contactService.identifyContact(identifyContactDto);
  }

}
