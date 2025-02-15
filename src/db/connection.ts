import { Sequelize } from "sequelize-typescript";
import Vendor from "../models/vendor/Vendor";
import Attachment from "../models/attachment/Attachment";
import AttachmentChunk from "../models/attachment/AttachmentChunk";
import AttachmentMapping from "../models/attachment/AttachmentMapping";
import ContactPerson from "../models/vendor/ContactPerson";
import VendorAddress from "../models/vendor/VendorAddress";
import VendorBank from "../models/vendor/VendorBank";
import VendorOther from "../models/vendor/VendorOther";
import VendorDocuments from "../models/vendor/VendorDocuments";
import VendorProfile from "../models/vendor/VendorProfile";

import * as mysql from "mysql2";

const connection = new Sequelize({
  dialect: "mysql",
  dialectModule: mysql,
  host: '62.72.3.60',
  username: 'brand-admin',
  password: 'Ek^fbhj0kQn1Hx',
  database: 'brand_analytics_test',
  // database: 'brand_analytics',
  port: 3306,
  models: [Attachment, AttachmentChunk, AttachmentMapping, Vendor, ContactPerson, VendorAddress, VendorBank, VendorOther, VendorDocuments, VendorProfile]
});
 
// connection.sync({ alter: true }); 

export default connection;