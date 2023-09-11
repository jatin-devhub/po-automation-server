import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Vendor from './Vendor';

@Table
export default class VendorOther extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
  })
  otherKey!: string;

  @Column({
    type: DataType.STRING,
  })
  otherValue!: string;

  @Column({
    type: DataType.STRING,
  })
  otherAtt!: string;

  @ForeignKey(() => Vendor)
  @Column({
    type: DataType.INTEGER,
  })
  vendorId!: number;

  @BelongsTo(() => Vendor)
  vendor?: Vendor;
}
