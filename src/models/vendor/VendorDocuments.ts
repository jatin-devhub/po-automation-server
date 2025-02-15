import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasOne, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import AttachmentMapping from "../attachment/AttachmentMapping";
import VendorProfile from "./VendorProfile";

@Table({
    tableName: 'vendor_documents'
})
export default class VendorDocuments extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => VendorProfile)
    @Column(DataType.INTEGER)
    vendorProfileId!: number;

    @AllowNull(false)
    @Unique
    @Column({
        type: DataType.STRING,
    })
    gstId!: string;

    @HasOne(() => AttachmentMapping, {
        foreignKey: 'entityId',
        scope: { attachmentType: 'GST' }
    })
    gstAttachment!: AttachmentMapping;

    @Unique
    @Column({
        type: DataType.STRING
    })
    coiId!: string;

    @HasOne(() => AttachmentMapping, {
        foreignKey: 'entityId',
        scope: { attachmentType: 'COI' }
    })
    coiAttachment!: AttachmentMapping;

    @Unique
    @Column({
        type: DataType.STRING
    })
    msmeId!: string;
    
    @HasOne(() => AttachmentMapping, {
        foreignKey: 'entityId',
        scope: { attachmentType: 'MSME' }
    })
    msmeAttachment!: AttachmentMapping;

    @Unique
    @Column({
        type: DataType.STRING
    })
    tradeMarkId!: string;
    
    @HasOne(() => AttachmentMapping, {
        foreignKey: 'entityId',
        scope: { attachmentType: 'TradeMark' }
    })
    tradeMarkAttachment!: AttachmentMapping;

    @HasOne(() => AttachmentMapping, {
        foreignKey: 'entityId',
        scope: { attachmentType: 'Agreement' }
    })
    agreementAttachment!: AttachmentMapping;

    @BelongsTo(() => VendorProfile)
    vendorProfile!: VendorProfile;
}
