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
    const phoneNumberString: string = String(phoneNumber);
    // Check if the contact already exists with the given email or phone number
    const existingContact = await this.contactRepository.findOne({
      where: [{ email }, { phoneNumber : phoneNumberString}],
    });

    if (existingContact) {
      // If an existing contact is found with a common email or phone number
      if (
        (existingContact.email && email && existingContact.email !== email) ||
        (existingContact.phoneNumber &&
          phoneNumber &&
          existingContact.phoneNumber !== phoneNumberString)
      ) {
        // Create a new secondary contact with the updated information
        const secondaryContact = this.contactRepository.create({
          email: email ? email : existingContact.email,
          phoneNumber: phoneNumber ? String(phoneNumber) : existingContact.phoneNumber,
          linkPrecedence: 'secondary',
          linkedId: existingContact.id,
        });

        await this.contactRepository.save(secondaryContact);
      }

      // Find all the secondary contacts linked to the primary contact
      const secondaryContacts = await this.contactRepository.find({
        where: { linkedId: existingContact.id },
      });

      const contact = {
        primaryContactId: existingContact.id,
        emails: [existingContact.email, ...secondaryContacts.map((c) => c.email)],
        phoneNumbers: [existingContact.phoneNumber, ...secondaryContacts.map((c) => c.phoneNumber)],
        secondaryContactIds: secondaryContacts.map((c) => c.id),
      };

      return { contact };
    } else {
      // If no existing contact is found, create a new primary contact
      const primaryContact = this.contactRepository.create({
        email,
        phoneNumber: String(phoneNumber),
        linkPrecedence: 'primary',
      });

      await this.contactRepository.save(primaryContact);

      const contact = {
        primaryContactId: primaryContact.id,
        emails: [primaryContact.email],
        phoneNumbers: [primaryContact.phoneNumber],
        secondaryContactIds: [],
      };

      return { contact };
    }
  }
}



