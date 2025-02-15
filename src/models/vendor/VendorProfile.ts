import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, Default, ForeignKey, HasMany, HasOne, IsEmail, Model, PrimaryKey, Table } from "sequelize-typescript";
import Vendor from "./Vendor";
import ContactPerson from "./ContactPerson";
import VendorAddress from "./VendorAddress";
import VendorBank from "./VendorBank";
import VendorOther from "./VendorOther";
// import Comment from "../Comment";
import VendorDocuments from "./VendorAttachments";

@Table({
    tableName: 'vendor_profile'
})
export default class VendorProfile extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => Vendor)
    @Column(DataType.INTEGER)
    vendorId!: number;

    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN
    })
    isVerified!: boolean

    @IsEmail
    @Column({
        type: DataType.STRING
    })
    createdBy!: string

    @HasOne(() => VendorDocuments)
    documents!: VendorDocuments;

    @HasOne(() => ContactPerson)
    contactPerson!: ContactPerson;

    @HasOne(() => VendorAddress)
    address!: VendorAddress;

    @HasOne(() => VendorBank)
    vendorBank?: VendorBank;

    @HasMany(() => VendorOther)
    otherFields!: VendorOther[];

    // @HasMany(() => Comment)
    // comments!: Comment[]

    @BelongsTo(() => Vendor)
    vendor?: Vendor;
}