import { Sequelize } from "sequelize-typescript";
import Vendor from "../models/Vendor";
import VendorBank from "../models/VendorBank";
import VendorOther from "../models/VendorOther";
import SKU from "../models/SKU";
import BuyingOrder from "../models/BuyingOrder";
import BuyingOrderRecord from "../models/BuyingOrderRecord";
import File from "../models/File";
import * as mysql from "mysql2";
import ContactPerson from "../models/ContactPerson";
import VendorAddress from "../models/VendorAddress";
import Comment from "../models/Comment";
import BOInvoices from "../models/BOInvoices";
import BuyingOrderOther from "../models/BuyingOrderOther";

const connection = new Sequelize({
  dialect: "mysql",
  dialectModule: mysql,
  host: '62.72.3.60',
  username: 'poadmin',
  password: 'po1234',
  // database: 'po_testing',
  database: 'po_automation',
  port: 3306,
  models: [Vendor, ContactPerson, VendorAddress, VendorBank, VendorOther, SKU, BuyingOrder, BuyingOrderRecord, File, Comment, BOInvoices, BuyingOrderOther]
});

// connection.sync({ alter: true }); 

export default connection;