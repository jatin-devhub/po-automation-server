import { Model, Table, Column, DataType, ForeignKey, BelongsTo, HasOne, AutoIncrement, PrimaryKey, AllowNull } from 'sequelize-typescript';
import VendorProfile from './VendorProfile';
import AttachmentMapping from '../attachment/AttachmentMapping';

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

  @HasOne(() => AttachmentMapping, {
    foreignKey: 'entityId',
    scope: { attachmentType: 'otherField' }
  })
  otherAttachment!: AttachmentMapping;

  @ForeignKey(() => VendorProfile)
  @Column({
    type: DataType.INTEGER,
  })
  vendorProfileId!: number;

  @BelongsTo(() => VendorProfile)
  vendorProfile?: VendorProfile;
}
