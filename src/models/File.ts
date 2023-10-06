import { Model, Table, Column, DataType, ForeignKey, BelongsTo, AutoIncrement, PrimaryKey, AllowNull } from 'sequelize-typescript';
import BuyingOrder from './BuyingOrder';
import SKU from './SKU';
import Vendor from './Vendor';
import VendorBank from './VendorBank';
import VendorOther from './VendorOther';

@Table({
  tableName: 'files',
})
export default class File extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER
  })
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING
  })
  fileName!: string;

  @AllowNull(false)
  @Column({
    type: DataType.BLOB('medium')
  })
  fileContent!: Buffer;

  @Column({
    type: DataType.STRING
  })
  fileType!: string;

  @ForeignKey(() => BuyingOrder)
  @Column({
    type: DataType.INTEGER
  })
  buyingOrderId!: number

  @ForeignKey(() => Vendor)
  @Column({
    type: DataType.INTEGER
  })
  gstAttVendorId!: number;

  @ForeignKey(() => Vendor)
  @Column({
    type: DataType.INTEGER
  })
  coiAttVendorId!: number;

  @ForeignKey(() => Vendor)
  @Column({
    type: DataType.INTEGER
  })
  msmeAttVendorId!: number;

  @ForeignKey(() => Vendor)
  @Column({
    type: DataType.INTEGER
  })
  tradeMarkAttVendorId!: number;

  @ForeignKey(() => Vendor)
  @Column({
    type: DataType.INTEGER
  })
  agreementAttVendorId!: number;

  @ForeignKey(() => VendorBank)
  @Column({
    type: DataType.INTEGER
  })
  vendorBankId!: number;

  @ForeignKey(() => VendorOther)
  @Column({
    type: DataType.INTEGER
  })
  vendorOtherId!: number;

  @BelongsTo(() => BuyingOrder)
  buyingOrder!: BuyingOrder;

  @BelongsTo(() => Vendor, 'gstAttVendorId')
  gstAttVendor!: Vendor;

  @BelongsTo(() => Vendor, 'coiAttVendorId')
  coiAttVendor!: Vendor;

  @BelongsTo(() => Vendor, 'msmeAttVendorId')
  msmeAttVendor!: Vendor;

  @BelongsTo(() => Vendor, 'tradeMarkAttVendorId')
  tradeMarkAttVendor!: Vendor;

  @BelongsTo(() => Vendor, 'agreementAttVendorId')
  agreementAttVendor!: Vendor;


  @BelongsTo(() => VendorBank)
  vendorBank!: VendorBank

  @BelongsTo(() => VendorOther)
  vendorOther!: VendorOther
}
