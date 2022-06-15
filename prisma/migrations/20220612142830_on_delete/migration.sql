-- DropForeignKey
ALTER TABLE "restaurants" DROP CONSTRAINT "restaurants_userId_fkey";

-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_userId_fkey";

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
