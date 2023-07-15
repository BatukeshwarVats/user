import { Injectable } from '@nestjs/common';
import { IdentifyContactDto } from './dto/identify-contact.dto';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async identifyContact(identifyContactDto: IdentifyContactDto) {
    const { email, phoneNumber } = identifyContactDto;

    let primaryContact: Contact;
  
    // Check if the contact already exists with the given email or phone number
    const existingContact = await this.contactRepository.findOne({ where: [{ email }, { phoneNumber }] });
  
    if (existingContact) {
      // If an existing contact is found, set it as the primary contact
      primaryContact = existingContact;
    } else {
      // If no existing contact is found, create a new primary contact
      primaryContact = this.contactRepository.create({ email, phoneNumber });
      primaryContact.linkPrecedence = 'primary';
      await this.contactRepository.save(primaryContact);
    }
  
    // Find all the secondary contacts linked to the primary contact
    const secondaryContacts = await this.contactRepository.find({ linkedId: primaryContact.id });
  
    const contact = {
      primaryContactId: primaryContact.id,
      emails: [primaryContact.email, ...secondaryContacts.map((c) => c.email)],
      phoneNumbers: [primaryContact.phoneNumber, ...secondaryContacts.map((c) => c.phoneNumber)],
      secondaryContactIds: secondaryContacts.map((c) => c.id),
    };
  
    return { contact };  }
}



