const Contact = require('../models/Contact');

exports.identify = async (email, phoneNumber) => {
  let contacts = [];

  if (email) {
    contacts = await Contact.find({ email });
  }
  if (phoneNumber) {
    contacts = contacts.concat(await Contact.find({ phoneNumber }));
  }

  contacts = contacts.filter((contact, index, self) =>
    index === self.findIndex((c) => c.id === contact.id)
  );

  let primaryContact;
  let secondaryContacts = [];

  if (contacts.length === 0) {
    primaryContact = new Contact({ email, phoneNumber, linkPrecedence: 'primary' });
    await primaryContact.save();
  } else {
    primaryContact = contacts.find(contact => contact.linkPrecedence === 'primary') || contacts[0];
    secondaryContacts = contacts.filter(contact => contact.id !== primaryContact.id);

    if (email && !contacts.some(contact => contact.email === email)) {
      const newSecondaryContact = new Contact({ email, phoneNumber, linkedId: primaryContact._id, linkPrecedence: 'secondary' });
      await newSecondaryContact.save();
      secondaryContacts.push(newSecondaryContact);
    }
    if (phoneNumber && !contacts.some(contact => contact.phoneNumber === phoneNumber)) {
      const newSecondaryContact = new Contact({ email, phoneNumber, linkedId: primaryContact._id, linkPrecedence: 'secondary' });
      await newSecondaryContact.save();
      secondaryContacts.push(newSecondaryContact);
    }

    if (!primaryContact.email) primaryContact.email = email;
    if (!primaryContact.phoneNumber) primaryContact.phoneNumber = phoneNumber;
    await primaryContact.save();
  }

  return {
    contact: {
      primaryContactId: primaryContact.id,
      emails: [primaryContact.email, ...secondaryContacts.map(contact => contact.email).filter(email => email)],
      phoneNumbers: [primaryContact.phoneNumber, ...secondaryContacts.map(contact => contact.phoneNumber).filter(phone => phone)],
      secondaryContactIds: secondaryContacts.map(contact => contact.id),
    },
  };
};
