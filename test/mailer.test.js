require('dotenv').config({ path: '.env' });

const chai = require('chai');
const sinon = require('sinon');
const nodemailer = require('nodemailer');
const { sendEmail } = require('../utils/mailer');
const expect = chai.expect;

chai.use(require('sinon-chai'));

describe('Mailer', () => {
  let createTransportStub;
  let sendMailStub;

  beforeEach(() => {
    sendMailStub = sinon.stub().resolves('Email sent');
    createTransportStub = sinon.stub(nodemailer, 'createTransport').returns({
      sendMail: sendMailStub,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should send an email', async () => {
    const to = 'pierrejaphetkonan@gmail.com';
    const subject = 'Mail de test';
    const text = 'This is a test email.';

    const result = await sendEmail(to, subject, text);

    expect(createTransportStub).to.have.been.calledOnce;
    expect(sendMailStub).to.have.been.calledOnceWith({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    expect(result).to.equal('Email sent');
  });
});
