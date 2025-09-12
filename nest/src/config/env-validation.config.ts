import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().port().required(),
  GLOBAL_PREFIX: Joi.string().required(),
  BASE_URL: Joi.string().uri().required(),

  NODE_ENV: Joi.string().valid('development', 'production').required(),

  JWT_SECRET_KEY: Joi.string().min(32).required(),
  JWT_EXPIRY_TIME: Joi.string()
    .pattern(/^[0-9]+[smhd]$/)
    .required(),

  REFRESH_SECRET_KEY: Joi.string().min(32).required(),
  REFRESH_EXPIRY_TIME: Joi.string()
    .pattern(/^[0-9]+[smhd]$/)
    .required(),

  SENDGRID_API_KEY: Joi.string()
    .pattern(/^SG\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)
    .required(),
  SENDGRID_VERIFIED_SENDER_EMAIL: Joi.string()
    .email({ tlds: false })
    .allow('')
    .required(),
  SENDGRID_VERIFIED_SENDER: Joi.string().required(),

  CRYPTO_SECRET: Joi.string().min(32).required(),

  REDIS_PORT: Joi.number().port().required(),
  REDIS_HOST: Joi.string().hostname().required(),

  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().port().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),

  AWS_S3_REGION: Joi.string().required(),
  AWS_S3_BUCKET: Joi.string().required(),
  AWS_ACCESS: Joi.string()
    .pattern(/^AKIA[A-Z0-9]{16}$/)
    .required(),
  AWS_SECRET: Joi.string().required(),

  AWS_S3_URL: Joi.string().uri().required(),
});
