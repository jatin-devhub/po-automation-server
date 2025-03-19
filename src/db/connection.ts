import { Sequelize } from "sequelize-typescript";
import Vendor from "../models/vendor/Vendor";
import Attachment from "../models/attachment/Attachment";
import AttachmentChunk from "../models/attachment/AttachmentChunk";
import AttachmentMapping from "../models/attachment/AttachmentMapping";
import ContactPerson from "../models/vendor/ContactPerson";
import VendorAddress from "../models/vendor/VendorAddress";
import VendorBank from "../models/vendor/VendorBank";
import VendorOther from "../models/vendor/VendorOther";
import VendorDocuments from "../models/vendor/VendorAttachments";
import VendorProfile from "../models/vendor/VendorProfile";
import SKU from "../models/sku/SKU";
import SKUDetails from "../models/sku/SKUDetails";
import SKUDimensions from "../models/sku/SKUDimensions";
import Comment from "../models/Comment";

import * as mysql from "mysql2";

const connection = new Sequelize({
  dialect: "mysql",
  dialectModule: mysql,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // database: 'brand_analytics',
  port: 3306,
  models: [Attachment, AttachmentChunk, AttachmentMapping, Vendor, ContactPerson, VendorAddress, VendorBank, VendorOther, VendorDocuments, VendorProfile, SKU, SKUDetails, SKUDimensions, Comment]
});
 
// connection.sync({ alter: true }); 

export default connection;