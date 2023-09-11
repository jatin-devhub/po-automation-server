import { Model, Table, Column, DataType, ForeignKey, BelongsTo, HasOne, AutoIncrement, PrimaryKey, AllowNull } from 'sequelize-typescript';
import Vendor from './Vendor';
import File from './File';

@Table
export default class VendorOther extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER
  })
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  otherKey!: string;

  @Column({
    type: DataType.STRING,
  })
  otherValue!: string;

  @HasOne(() => File)
  otherAtt!: File;

  @ForeignKey(() => Vendor)
  @Column({
    type: DataType.INTEGER,
  })
  vendorId!: number;

  @BelongsTo(() => Vendor)
  vendor?: Vendor;
}
