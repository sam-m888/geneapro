"""
Various views related to displaying the pedgree of a person graphically
"""

from django.db.models import F, Count
from .. import models
from .to_json import JSONView
from .related import JSONResult
from .styles import Styles
from .queries import PersonSet

class PersonaView(JSONView):
    """Display all details known about persona ID"""

    def get_json(self, params, id):
        persons = PersonSet()
        persons.add_ids(ids=[int(id)])
        persons.fetch_p2e(event_types=None)
        persons.fetch_p2c()
        persons.fetch_p2p()
        return JSONResult(asserts=persons.asserts).to_json({
            "person": persons.get_unique_person(),
            "asserts": persons.asserts,
        })


class SuretySchemesList(JSONView):
    """
    Return the list of all defined surety schemes
    """

    def get_json(self, params):
        return {
            "schemes": [
                {"id": s.id,
                 "name": s.name,
                 "description": s.description,
                 "parts": [
                     {"id": p.id,
                      "name": p.name,
                      "description": p.description,
                      "sequence": p.sequence_number}
                     for p in s.parts.all()
                 ]} for s in models.Surety_Scheme.objects.all()]}


class PersonCount(JSONView):
    """Number of persons in the database"""

    def get_json(self, params):
        namefilter = params.get('filter')

        r = models.Persona.objects \
            .filter(id=F('main_id')) \

        if namefilter:
            r = r.filter(display_name__icontains=namefilter)

        r = r.aggregate(count=Count('id'))
        return int(r['count'])


class PersonaList(JSONView):
    """View the list of all personas"""

    def get_json(self, params, decujus=1):
        persons = PersonSet(
            styles=Styles(params.get('theme', -1), decujus=decujus))
        persons.add_ids(
            namefilter=params.get('filter', None),
            offset=params.get('offset', None),
            limit=params.get('limit', None))
        persons.fetch_p2e()
        return persons
