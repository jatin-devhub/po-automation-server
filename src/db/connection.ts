import { Sequelize } from "sequelize-typescript";
import { Vendor } from "../models/Vendor";
import VendorBank from "../models/VendorBank";
import VendorOther from "../models/VendorOther";
import SKU from "../models/SKU";
import BuyingOrder from "../models/BuyingOrder";
import BuyingOrderRecord from "../models/BuyingOrderRecord";
import File from "../models/File";

const connection = new Sequelize({
  dialect: "mysql",
  host: '62.72.3.60',
  username: 'poadmin',
  password: 'po1234',
  database: 'po_automation',
  port: 3306,
  models: [Vendor, VendorBank, VendorOther, SKU, BuyingOrder, BuyingOrderRecord, File]
});

// connection.truncate({ cascade: true, restartIdentity: true });

export default connection;