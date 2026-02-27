import { Booking } from '../../../domain/entities/booking';
import { Property } from '../../../domain/entities/property';
import { User } from '../../../domain/entities/user';
import { DateRange } from '../../../domain/value_objects/date_range';
import { BookingEntity } from '../entities/booking_entity'
import { PropertyEntity } from '../entities/property_entity';
import { UserEntity } from '../entities/user_entity';
import { BookingMapper } from './booking_mapper';

describe('BookingMapper', () => {

  it("deve converter BookingEntity em Booking corretamente", () => {
    const guest = new UserEntity()
    guest.id = '1';
    guest.name = "User";

    const property = new PropertyEntity();
    property.id = '1';
    property.basePricePerNight = 100;
    property.description = 'Desc';
    property.maxGuests = 5;
    property.name = 'Name'

    const bookingEntity = new BookingEntity();
    bookingEntity.id = '1'
    bookingEntity.startDate = new Date('2026-02-13');
    bookingEntity.endDate = new Date('2026-02-23');
    bookingEntity.guest = guest;
    bookingEntity.guestCount = 2;
    bookingEntity.totalPrice = 100;
    bookingEntity.status = 'CONFIRMED';
    bookingEntity.property = property;

    const booking = BookingMapper.toDomain(bookingEntity);

    expect(booking).not.toBeNull();
    expect(booking.getId()).toBe('1');
    expect(booking.getGuestCount()).toBe(2);
    expect(booking.getStatus()).toBe('CONFIRMED');
    expect(booking.getTotalPrice()).toBe(100);
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
    const property = new PropertyEntity();
    property.id = '1';
    property.basePricePerNight = 100;
    property.description = 'Desc';
    property.maxGuests = 5;
    property.name = 'Name';

    const bookingEntity = new BookingEntity();
    bookingEntity.id = '1'
    bookingEntity.startDate = new Date('2026-02-13');
    bookingEntity.endDate = new Date('2026-02-23');
    bookingEntity.guestCount = 2;
    bookingEntity.totalPrice = 100;
    bookingEntity.status = 'CONFIRMED';
    bookingEntity.property = property;

    expect(() => {
      BookingMapper.toDomain(bookingEntity)
    }).toThrow(new TypeError("Cannot read properties of undefined (reading 'id')"));
  });

  it("deve converter Booking para BookingEntity corretamente", () => {
    const property = new Property(
      '1',
      'name',
      'desc',
      5,
      100
    );

    const user = new User(
      '1',
      "name"
    );

    const booking = new Booking(
      '1',
      property,
      user,
      new DateRange(new Date('2026-02-13'), new Date('2026-02-23')),
      4
    );


    const bookingEntity = BookingMapper.toPersistence(booking);

    expect(bookingEntity).not.toBeNull();
    expect(bookingEntity.id).toBe('1');
    expect(bookingEntity.guestCount).toBe(4);
    expect(bookingEntity.status).toBe('CONFIRMED');
    expect(bookingEntity.totalPrice).toBe(900);
  })



})