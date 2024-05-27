import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const buildSwagger = (app) => {
  const config = new DocumentBuilder()
    .setTitle('Booking')
    .setDescription('The Booking API description')
    .setVersion('1.0')
    .addGlobalParameters({
      in: 'header',
      required: true,
      name: 'Accept-Language',
      schema: {
        type: 'string',
        default: 'fr', // Default language
        enum: ['fr', 'en', 'ar'] // Available languages
      }
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);

  return document;
};

export const setupSwagger = (app) => {
  const document = buildSwagger(app);
  SwaggerModule.setup('api', app, document);
};
