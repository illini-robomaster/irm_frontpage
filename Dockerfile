#
# Copyright (C) 2025 RoboMaster.
# Illini RoboMaster @ University of Illinois at Urbana-Champaign
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
FROM rtsp/lighttpd

# Install necessary packages
RUN apk add --no-cache curl tini php-cgi

# Create necessary directories
RUN mkdir -p /etc/cloudflared /usr/local/bin

# Copy files
COPY src/cloudflared /etc/cloudflared
COPY src/init.sh /usr/local/bin/init.sh

# Install cloudflared
RUN curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 \
         -o /usr/local/bin/cloudflared

# Set permissions
RUN chmod +x /usr/local/bin/init.sh \
             /usr/local/bin/cloudflared

# Modify lighttpd
RUN sed -i 's/^\(server\.port = \).*/\18081/' \
           /etc/lighttpd/conf.d/01-server.conf

# Set entrypoint with tini as init system
ENTRYPOINT ["/sbin/tini", "--", "/bin/sh", "/usr/local/bin/init.sh"]
