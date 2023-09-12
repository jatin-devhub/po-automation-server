import { Model, Table, Column, DataType, ForeignKey, BelongsTo, AutoIncrement, PrimaryKey, AllowNull, HasOne } from 'sequelize-typescript';
import Vendor from './Vendor';
import File from './File';

@Table
export default class VendorBank extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
  })
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  beneficiaryName!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  accountNumber!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  ifsc!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  bankName!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  branch!: string;

  @HasOne(() => File)
  proofAtt!: File;

  @ForeignKey(() => Vendor)
  @Column({
    type: DataType.INTEGER,
  })
  vendorId!: number;

  @BelongsTo(() => Vendor)
  vendor?: Vendor;
}
