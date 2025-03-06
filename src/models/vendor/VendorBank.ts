import { Model, Table, Column, DataType, ForeignKey, BelongsTo, AutoIncrement, PrimaryKey, AllowNull, HasOne } from 'sequelize-typescript';
import VendorProfile from './VendorProfile';
import AttachmentMapping from '../attachment/AttachmentMapping';

@Table({
  tableName: 'vendor_bank'
})
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

  @HasOne(() => AttachmentMapping, {
    foreignKey: 'entityId',
    scope: { attachmentType: 'bankProof' }
  })
  bankProof!: AttachmentMapping;

  @ForeignKey(() => VendorProfile)
  @Column({
    type: DataType.INTEGER,
  })
  vendorProfileId!: number;

  @BelongsTo(() => VendorProfile)
  vendorProfile?: VendorProfile;
}
