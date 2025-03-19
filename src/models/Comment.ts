import { Model, Table, Column, DataType, ForeignKey, BelongsTo, AllowNull, AutoIncrement, PrimaryKey } from 'sequelize-typescript';
import VendorProfile from './vendor/VendorProfile';

@Table({
  tableName: 'comments',
})
export default class Comment extends Model {
  @AllowNull(false)
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
  comment!: string;

  @ForeignKey(() => VendorProfile)
  @Column({
    type: DataType.INTEGER
  })
  vendorProfileId!: number

  @BelongsTo(() => VendorProfile)
  vendorProfile!: VendorProfile;
  
}
